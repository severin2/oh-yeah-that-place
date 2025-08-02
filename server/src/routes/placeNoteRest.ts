import {
  CreatePlaceNoteSchema,
  UpdatePlaceNoteSchema,
  type CreatePlaceNoteResponse,
  type DeletePlaceNoteResponse,
  type GetPlaceNotesResponse,
  type PlaceNote,
  type UpdatePlaceNoteResponse,
} from "@shared/api/placeNote";
import { NextFunction, Request, Response, Router } from "express";
import { v4 as uuidv4 } from "uuid";

export const placeNoteRouter = Router();

// In-memory storage for now (same data as before)
const memoryStore: PlaceNote[] = [
  {
    id: "6ae5f357-c0fe-4ba9-ab74-f0a6384efac8",
    title: "Test 1",
    note: "This is a test note",
    notifyEnabled: true,
    notifyDistance: 1000,
    latitude: 40.08485509988256,
    longitude: -104.95040606707335,
    createdAt: new Date("2025-07-01T04:17:57.524Z"),
  },
  {
    id: "6ae5f357-c0fe-4ba9-ab74-f0a6384efac9",
    title: "Casa Cortes",
    note: "Good mexican food",
    notifyEnabled: true,
    notifyDistance: 1500,
    latitude: 40.087509,
    longitude: -104.935554,
    createdAt: new Date("2025-07-01T04:17:57.524Z"),
  },
];

/**
 * GET /api/place-notes
 * Get all place notes
 */
placeNoteRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(
      `[${new Date().toISOString()}] GET /api/place-notes - Fetching all place notes`
    );

    try {
      const response: GetPlaceNotesResponse = {
        data: memoryStore,
        status: "success",
      };

      console.log(
        `[${new Date().toISOString()}] GET /api/place-notes - Success: Returned ${
          memoryStore.length
        } place notes`
      );
      res.json(response);
    } catch (error) {
      console.error(
        `[${new Date().toISOString()}] GET /api/place-notes - Error:`,
        error
      );
      const response: GetPlaceNotesResponse = {
        status: "error",
        error: "Failed to fetch place notes",
      };
      res.status(500).json(response);
    }
  }
);

/**
 * POST /api/place-notes
 * Create a new place note
 */
placeNoteRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(
      `[${new Date().toISOString()}] POST /api/place-notes - Creating new place note`
    );
    console.log(
      `[${new Date().toISOString()}] POST /api/place-notes - Request body:`,
      JSON.stringify(req.body, null, 2)
    );

    try {
      // Validate input
      const validationResult = CreatePlaceNoteSchema.safeParse(req.body);
      if (!validationResult.success) {
        console.log(
          `[${new Date().toISOString()}] POST /api/place-notes - Validation failed:`,
          validationResult.error.issues
        );
        const response: CreatePlaceNoteResponse = {
          status: "error",
          error: `Invalid input: ${validationResult.error.issues
            .map((i) => i.message)
            .join(", ")}`,
        };
        res.status(400).json(response);
        return;
      }

      const input = validationResult.data;
      const newNote: PlaceNote = {
        id: uuidv4(),
        title: input.title,
        note: input.note,
        notifyEnabled: input.notifyEnabled,
        notifyDistance: input.notifyDistance,
        latitude: input.latitude,
        longitude: input.longitude,
        createdAt: new Date(),
      };

      memoryStore.push(newNote);
      console.log(
        `[${new Date().toISOString()}] POST /api/place-notes - Success: Created place note with ID ${
          newNote.id
        }`
      );

      const response: CreatePlaceNoteResponse = {
        data: newNote,
        status: "success",
      };
      res.status(201).json(response);
    } catch (error) {
      console.error(
        `[${new Date().toISOString()}] POST /api/place-notes - Error:`,
        error
      );
      const response: CreatePlaceNoteResponse = {
        status: "error",
        error: "Failed to create place note",
      };
      res.status(500).json(response);
    }
  }
);

/**
 * PUT /api/place-notes/:id
 * Update an existing place note
 */
placeNoteRouter.put(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    console.log(
      `[${new Date().toISOString()}] PUT /api/place-notes/${id} - Updating place note`
    );
    console.log(
      `[${new Date().toISOString()}] PUT /api/place-notes/${id} - Request body:`,
      JSON.stringify(req.body, null, 2)
    );

    try {
      // Validate input
      const validationResult = UpdatePlaceNoteSchema.safeParse(req.body);
      if (!validationResult.success) {
        console.log(
          `[${new Date().toISOString()}] PUT /api/place-notes/${id} - Validation failed:`,
          validationResult.error.issues
        );
        const response: UpdatePlaceNoteResponse = {
          status: "error",
          error: `Invalid input: ${validationResult.error.issues
            .map((i) => i.message)
            .join(", ")}`,
        };
        res.status(400).json(response);
        return;
      }

      const updateData = validationResult.data;
      const noteIndex = memoryStore.findIndex((note) => note.id === id);

      if (noteIndex === -1) {
        console.log(
          `[${new Date().toISOString()}] PUT /api/place-notes/${id} - Place note not found`
        );
        const response: UpdatePlaceNoteResponse = {
          status: "error",
          error: "Place note not found",
        };
        res.status(404).json(response);
        return;
      }

      // Update the note
      const updatedNote = { ...memoryStore[noteIndex], ...updateData };
      memoryStore[noteIndex] = updatedNote;
      console.log(
        `[${new Date().toISOString()}] PUT /api/place-notes/${id} - Success: Updated place note`
      );

      const response: UpdatePlaceNoteResponse = {
        data: updatedNote,
        status: "success",
      };
      res.json(response);
    } catch (error) {
      console.error(
        `[${new Date().toISOString()}] PUT /api/place-notes/${id} - Error:`,
        error
      );
      const response: UpdatePlaceNoteResponse = {
        status: "error",
        error: "Failed to update place note",
      };
      res.status(500).json(response);
    }
  }
);

/**
 * DELETE /api/place-notes/:id
 * Delete a place note
 */
placeNoteRouter.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    console.log(
      `[${new Date().toISOString()}] DELETE /api/place-notes/${id} - Deleting place note`
    );

    try {
      const noteIndex = memoryStore.findIndex((note) => note.id === id);

      if (noteIndex === -1) {
        console.log(
          `[${new Date().toISOString()}] DELETE /api/place-notes/${id} - Place note not found`
        );
        const response: DeletePlaceNoteResponse = {
          status: "error",
          error: "Place note not found",
        };
        res.status(404).json(response);
        return;
      }

      // Remove the note
      memoryStore.splice(noteIndex, 1);
      console.log(
        `[${new Date().toISOString()}] DELETE /api/place-notes/${id} - Success: Deleted place note`
      );

      const response: DeletePlaceNoteResponse = {
        status: "success",
      };
      res.status(204).json(response);
    } catch (error) {
      console.error(
        `[${new Date().toISOString()}] DELETE /api/place-notes/${id} - Error:`,
        error
      );
      const response: DeletePlaceNoteResponse = {
        status: "error",
        error: "Failed to delete place note",
      };
      res.status(500).json(response);
    }
  }
);
