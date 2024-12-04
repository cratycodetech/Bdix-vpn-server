import { exec } from 'child_process';

// Function to ping the server and check connectivity
export const pingServer = async (serverIP: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    exec(`ping -c 1 ${serverIP}`, (error, stdout, stderr) => {
      if (error || stderr) {
        console.error('Ping failed:', error || stderr);
        return resolve(false);  // Return false if ping fails
      }
      console.log('Ping successful:', stdout);
      resolve(true);  // Return true if ping is successful
    });
  });
};
