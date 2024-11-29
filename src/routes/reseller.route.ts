import { Router } from "express";
import {
    getTotalResellersCount,
    getTotalCredits,
    countTotalActivePremiumUsers ,
    getLowCreditResellers,
    findResellerByName,
    getTotalPremiumUsersForAllResellers,
    getTotalPremiumUsersForAllReseller,
    getResellerDetails,
  } from '../controller/reseller.controller';
  
  const router = Router(); 
  
  //get total resellers count
  router.get('/total-resellers', getTotalResellersCount);

  // Route to count total premium users
  router.get("/count",countTotalActivePremiumUsers );

  // Route to find a reseller by name
  router.get("/find-reseller/:name", findResellerByName);

  //get total users for all resellers
  //router.get('/users/count',getTotalPremiumUsersForAllResellers);

  //get total users for all resellers
  router.get('/users/counts',getTotalPremiumUsersForAllReseller);
  
  //get total available credits of all resellers
  router.get('/total-credits', getTotalCredits);
  
  //get resellers with low credits (threshold provided as query parameter)
  router.get('/low-credits', getLowCreditResellers);
  
  //get details of a specific reseller (by ID)
  router.get('/:id', getResellerDetails);

export default router;
