import type { TransaksiData } from '../components/Transaksi/TransaksiForm';

// Client ID dan API Key dari Google Cloud Console
const CLIENT_ID = 'YOUR_CLIENT_ID';
const API_KEY = 'YOUR_API_KEY';

// Array of API discovery doc URLs for APIs used by the app
const DISCOVERY_DOCS = ['https://sheets.googleapis.com/$discovery/rest?version=v4'];

// Authorization scopes required by the API
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

// ID spreadsheet Google Sheets (ganti dengan ID spreadsheet Anda)
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';

class GoogleSheetsService {
  private gapiInitialized = false;
  private gisInitialized = false;
  private tokenClient: google.accounts.oauth2.TokenClient | null = null;
  
  /**
   * Initialize the API client library
   */
  async init(): Promise<void> {
    if (this.gapiInitialized && this.gisInitialized) {
      return;
    }
    
    try {
      // Load the gapi client library
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = () => {
          gapi.load('client', async () => {
            try {
              await gapi.client.init({
                apiKey: API_KEY,
                discoveryDocs: DISCOVERY_DOCS,
              });
              this.gapiInitialized = true;
              resolve();
            } catch (error) {
              reject(error);
            }
          });
        };
        script.onerror = (error) => reject(error);
        document.body.appendChild(script);
      });
      
      // Load the gis client library
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.onload = () => {
          this.tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: '', // defined later
          });
          this.gisInitialized = true;
          resolve();
        };
        script.onerror = (error) => reject(error);
        document.body.appendChild(script);
      });
    } catch (error) {
      console.error('Error initializing Google API:', error);
      throw error;
    }
  }
  
  /**
   * Authenticate with Google
   */
  async authenticate(): Promise<void> {
    if (!this.gapiInitialized || !this.gisInitialized || !this.tokenClient) {
      await this.init();
    }
    
    return new Promise<void>((resolve, reject) => {
      try {
        // Check if we already have access
        if (gapi.client.getToken()) {
          resolve();
          return;
        }
        
        // Set the callback for the tokenClient
        this.tokenClient!.callback = (resp) => {
          if (resp.error) {
            reject(resp);
          } else {
            resolve();
          }
        };
        
        // Request an access token
        this.tokenClient!.requestAccessToken({ prompt: 'consent' });
      } catch (error) {
        console.error('Error authenticating with Google:', error);
        reject(error);
      }
    });
  }
  
  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!gapi.client.getToken();
  }
  
  /**
   * Sign out from Google
   */
  signOut(): void {
    const token = gapi.client.getToken();
    if (token) {
      google.accounts.oauth2.revoke(token.access_token);
      gapi.client.setToken(null);
    }
  }
  
  /**
   * Add a transaction to Google Sheets
   */
  async addTransaction(transaction: TransaksiData): Promise<void> {
    if (!this.isAuthenticated()) {
      await this.authenticate();
    }
    
    try {
      // Format the data for Google Sheets
      const values = [
        [
          transaction.tanggal,
          transaction.bulan,
          transaction.tahun,
          transaction.keterangan,
          transaction.akun,
          transaction.debit,
          transaction.kredit
        ]
      ];
      
      // Determine the sheet name based on the account
      const sheetName = transaction.akun.replace(/\s+/g, '_');
      
      // Check if the sheet exists, if not create it
      await this.ensureSheetExists(sheetName);
      
      // Append the data to the sheet
      await gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!A:G`,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values
        }
      });
    } catch (error) {
      console.error('Error adding transaction to Google Sheets:', error);
      throw error;
    }
  }
  
  /**
   * Ensure a sheet exists for the given account
   */
  private async ensureSheetExists(sheetName: string): Promise<void> {
    try {
      // Get the spreadsheet
      const response = await gapi.client.sheets.spreadsheets.get({
        spreadsheetId: SPREADSHEET_ID
      });
      
      // Check if the sheet already exists
      const sheets = response.result.sheets;
      const sheetExists = sheets?.some(sheet => sheet.properties?.title === sheetName);
      
      if (!sheetExists) {
        // Create a new sheet
        await gapi.client.sheets.spreadsheets.batchUpdate({
          spreadsheetId: SPREADSHEET_ID,
          resource: {
            requests: [
              {
                addSheet: {
                  properties: {
                    title: sheetName,
                    gridProperties: {
                      rowCount: 1000,
                      columnCount: 7
                    }
                  }
                }
              }
            ]
          }
        });
        
        // Add headers to the new sheet
        await gapi.client.sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: `${sheetName}!A1:G1`,
          valueInputOption: 'USER_ENTERED',
          resource: {
            values: [['Tanggal', 'Bulan', 'Tahun', 'Keterangan', 'Akun', 'Debit', 'Kredit']]
          }
        });
      }
    } catch (error) {
      console.error('Error ensuring sheet exists:', error);
      throw error;
    }
  }
  
  /**
   * Get all transactions from Google Sheets
   */
  async getAllTransactions(): Promise<TransaksiData[]> {
    if (!this.isAuthenticated()) {
      await this.authenticate();
    }
    
    try {
      // Get the spreadsheet to find all sheets
      const spreadsheet = await gapi.client.sheets.spreadsheets.get({
        spreadsheetId: SPREADSHEET_ID
      });
      
      const sheets = spreadsheet.result.sheets;
      const allTransactions: TransaksiData[] = [];
      
      // For each sheet, get the data
      for (const sheet of sheets || []) {
        const sheetName = sheet.properties?.title;
        if (!sheetName || sheetName === 'Sheet1') continue; // Skip default sheet
        
        const response = await gapi.client.sheets.spreadsheets.values.get({
          spreadsheetId: SPREADSHEET_ID,
          range: `${sheetName}!A:G`
        });
        
        const rows = response.result.values;
        if (rows && rows.length > 1) { // Skip header row
          for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (row.length >= 7) {
              allTransactions.push({
                tanggal: row[0],
                bulan: row[1],
                tahun: row[2],
                keterangan: row[3],
                akun: row[4],
                debit: parseFloat(row[5]) || 0,
                kredit: parseFloat(row[6]) || 0
              });
            }
          }
        }
      }
      
      return allTransactions;
    } catch (error) {
      console.error('Error getting transactions from Google Sheets:', error);
      throw error;
    }
  }
}

export default new GoogleSheetsService();