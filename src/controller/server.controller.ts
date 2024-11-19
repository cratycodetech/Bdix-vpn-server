import { NextFunction, Request, Response } from "express";
import Server from "./../model/server.model";

// get all servers
export const getAllServers = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const servers = await Server.find()

    res.status(200).json({
      message: "Servers get successfully",
      data: servers,
    });
  } catch (err: any) {
    next(err)
  }
};

// get single server
export const getSingleServer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const server = await Server.findOne({ _id: req.params.id });

    if (!server) {
      throw new Error("Server Not found")
    }

    res.status(200).json({
      message: "Server get successfully",
      data: server,
    });
  } catch (err: any) {
    next(err)
  }
};

// get all servers filter by status
export const getAllServerStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const servers = await Server.find({ status: req.params.status});

    if (!servers) {
      throw new Error("servers not found")
    }

    res.status(200).json({
      message: "Servers status get successfully",
      data: servers,
    });
  } catch (err: any) {
    next(err)
  }
};

// get  count all active servers
export const getCountActiveServer = async (req: Request, res: Response, next: NextFunction) => {
    try {
     const activeCount = await Server.countDocuments({ status: "active" });
  
      res.status(200).json({
        message: "active servers count get successfully",
        data: activeCount,
      });
    } catch (err: any) {
      next(err)
    }
  };
  

// create new server
export const createServer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;

    if (Object.keys(data).length === 0) {
      throw new Error("Data can't be empty")
    }

    const server = await Server.create(data);

    res.status(201).json({
      message: "Server created Successfully",
      data: server,
    });
  } catch (err: any) {
    next(err)
  }
};

// update a server
export const updateServer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const serverId = req.params.id;
    const server = await Server.findById(serverId);

    if (!server) {
      throw new Error("Server not found")
    }

    const updatedServer = await Server.findByIdAndUpdate(serverId, req.body);

    res.status(200).json({
      message: "Server updated successfully",
      data: updatedServer,
    });
  } catch (err: any) {
    next(err)
  }
};

// delete server
export const deleteServer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const server = await Server.findByIdAndDelete(req.params.id);

    if (!server) {
      throw new Error("Server not found")
    }

    res.status(200).json({
      message: "Server Deleted Successfully",
    });
  } catch (err: any) {
    next(err)
  }
};

// update server status
export const updateServerStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const server = await Server.findByIdAndUpdate(
      req.params.id,
      { $set: { status: req.body.status } },
      { new: true },
    );

    if (!server) {
      throw new Error("server not found")
    }

    res.status(200).json({
      message: " server status changed successfully",
      data: server,
    });
  } catch (err: any) {
    next(err)
  }
};
