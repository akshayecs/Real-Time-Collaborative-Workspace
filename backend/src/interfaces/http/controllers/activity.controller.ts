import { Request, Response } from "express";
import { ListActivityUseCase } from "../../../application/activity/list-activity.usecase";

export class ActivityController {
    async list(req: Request, res: Response) {
        const { workspaceId } = req.params;
        const logs = await new ListActivityUseCase().execute(workspaceId);
        res.json(logs);
    }
}
