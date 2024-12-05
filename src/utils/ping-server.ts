// import { exec } from 'child_process';

// // Function to ping the server and check connectivity
// export const pingServer = async (serverIP: string): Promise<boolean> => {
//   return new Promise((resolve, reject) => {
//     exec(`ping -c 1 ${serverIP}`, (error, stdout, stderr) => {
//       if (error || stderr) {
//         console.error('Ping failed:', error || stderr);
//         return resolve(false);  // Return false if ping fails
//       }
//       console.log('Ping successful:', stdout);
//       resolve(true);  // Return true if ping is successful
//     });
//   });
// };


import ping from 'ping';

export const pingServer = async (serverIP: string): Promise<boolean> => {
  try {
    const res = await ping.promise.probe(serverIP);
    return res.alive; // true if the server responds, false otherwise
  } catch (error) {
    console.error("Ping failed:", error);
    return false;
  }
};

