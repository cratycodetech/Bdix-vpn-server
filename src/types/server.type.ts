export type Server= {
    _id: string; // MongoDB generated ID
    serverName: string; // Name of the server
    serverLocation: string; // Location of the server
    CPUallocation?: string; // Optional CPU allocation
    memoryAllocation?: string; // Optional memory allocation
    ipAddress: string; // Server's IP address
    serverTag?: 'Instagram' | 'Google ads' ; // Enum with default value 'online'
    status:'active' | 'inactive';
  }
  