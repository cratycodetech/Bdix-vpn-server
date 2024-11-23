import { Router } from "express";
import authRoutes from "./../routes/auth.route";
import serverRoutes from "./../routes/server.route";
import creditRoutes from "./../routes/credit.route";



const router = Router();

// Root route
router.get("/", (_, res) => {
  res.send("App Working successfully");
});

// general Routes
router.use("/auth", authRoutes);
router.use("/server", serverRoutes);
router.use("/credit", creditRoutes);




// Handle not found
router.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Not Found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API Not Found",
      },
    ],
  });
  next();
});

export default router;
