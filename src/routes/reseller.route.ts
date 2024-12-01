import { Router } from "express";
import {
    getTotalResellersCount,
    getTotalCredits,
    countTotalActivePremiumUsers ,
    filterPremiumUsersByResellerId,
    getLowCreditResellers,
    getTotalPremiumUsersForAllReseller,
    filterPremiumUsersByResellerName,
    filterPremiumUsersByResellerCredit,
    filterPremiumUsersByTotalUsers,
    getAllUsersForSingleReseller,
    getResellerDetails,
  } from '../controller/reseller.controller';
  
  const router = Router(); 

  
  //get total resellers count
  router.get('/total-resellers', getTotalResellersCount);

  // get count total premium users
  router.get("/count",countTotalActivePremiumUsers);

  // get all filter premium users by resellerId
  router.get("/resellerId", filterPremiumUsersByResellerId);

  // get all filter premium users by resellerName
  router.get("/resellerName", filterPremiumUsersByResellerName);

  // get all filter premium users by resellerCredit
  router.get("/resellerCredit", filterPremiumUsersByResellerCredit);

  // get all filter premium users by totalPremiumUsers
  router.get("/totalUsers", filterPremiumUsersByTotalUsers);

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

  // Route to get premium users for a single reseller by resellerId
  router.get('/single/:resellerId', getAllUsersForSingleReseller);


export default router;
