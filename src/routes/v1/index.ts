import { Router } from "express";
import inventoryRoutes from "./inventory.routes";
import storeRoutes from "./store.routes";

const router = Router({ mergeParams: true });

router.use("/inventory", inventoryRoutes);
router.use("/store", storeRoutes);


export default router;
