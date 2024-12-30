import { Router } from "express";
import {
    getAllResellers,
    getAllReseller ,
    getSingleResellerAvailableCredit,
    getTotalCredits,
    countTotalActivePremiumUsers ,
    filterPremiumUsersByResellerId,
    getLowCreditResellers,
    countActiveResellers,
    getTotalPremiumUsersForAllReseller,
    filterPremiumUsersByResellerName,
    filterPremiumUsersByResellerCredit,
    filterPremiumUsersByTotalUsers,
    getAllUsersForSingleReseller,
    getResellerDetails,
  } from '../controller/reseller.controller';
  
  const router = Router(); 

  
  //get all reseller info and total count resellers
  router.get('/all', getAllReseller )
  //get details of a specific reseller (by ID)
  router.get('/:id', getResellerDetails);

  // get single reseller available credits
  router.get("/single-reseller/:email", getSingleResellerAvailableCredit);

  //get total active resellers count
  router.get('/active/count', countActiveResellers);

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

  //get all users for a single reseller by resellerId
  router.get('/single/:resellerId', getAllUsersForSingleReseller);


export default router;
