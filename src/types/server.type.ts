export type Server= {
    _id: string; 
    serverName: string; 
    protocal?: string; 
    userName?: string;
    serverLocation: string; 
    ipAddress: string; 
    serverTag?: 'Instagram' | 'Google ads' ; 
    status:'active' | 'inactive';
    password: string;
  }
  