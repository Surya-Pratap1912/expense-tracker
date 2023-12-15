const express = require("express");
const path = require("path");
const router = express.Router();

const expanse = require("../controllers/expanse");
const userAuth = require("../middleware/auth");
const purchaseController = require("../controllers/purchase");
const premium = require("../controllers/premium");


router.get("/expanse-tracker", (req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "views", "expanseTracker.html"));
  });
  router.get("/showAll.html", (req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "views", "showAllExpanse.html"));
  });
  
  
// //expanse
router.post('/add-expanse',userAuth.Authenticate, expanse.addExpanse);

router.get('/get-expanse',userAuth.Authenticate, expanse.getExpanse);

router.delete('/delete-expanse/:prodId',userAuth.Authenticate, expanse.deleteExpanse);

router.put('/update-expanse/:prodId',userAuth.Authenticate, expanse.updateExpanse);

// //premium

router.get('/purhase/premuiumMembership',userAuth.Authenticate,purchaseController.purchasePremium);
 router.post('/purchase/updatetransectionstatus',userAuth.Authenticate,purchaseController.updatetransectionstatus);

router.get('/premium/showLeaderBoard',userAuth.Authenticate,premium.showLead )

router.get('/dowload/download-expanse',userAuth.Authenticate,expanse.downloadExpanse )

// router.get('/generate-pdf',userAuth.Authenticate, expanse.downloadExpanseAsPdf)

module.exports = router;
