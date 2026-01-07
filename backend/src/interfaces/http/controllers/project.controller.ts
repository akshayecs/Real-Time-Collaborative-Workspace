import { Request, Response } from "express";

import { CreateProjectUseCase } from "../../../application/project/create-project.usecase";
import { ListProjectsUseCase } from "../../../application/project/list-projects.usecase";

export class ProjectController {
    async create(req: Request, res: Response) {
        const { name, description } = req.body;
        const project = await new CreateProjectUseCase().execute(
            (req as any).user!.id,
            name,
            description
        );
        res.status(201).json(project);
    }

    async list(req: Request, res: Response) {
        const projects = await new ListProjectsUseCase().execute((req as any).user!.id);
        res.json(projects);
    }
}
