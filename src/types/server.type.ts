export type Server= {
    _id: string; 
    serverName: string; 
    serverLocation: string; 
    CPUallocation?: string; 
    memoryAllocation?: string; 
    ipAddress: string; 
    serverTag?: 'Instagram' | 'Google ads' ; 
    status:'active' | 'inactive';
    password: string;
  }
  