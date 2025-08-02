import type {
  PlaceNote,
  CreatePlaceNoteInput,
  UpdatePlaceNoteInput,
  GetPlaceNotesResponse,
  CreatePlaceNoteResponse,
  UpdatePlaceNoteResponse,
  DeletePlaceNoteResponse,
} from "@shared/api/placeNote";

const getBaseUrl = () => {
  return process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:4000";
};

class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new ApiError(`API request failed: ${errorText}`, response.status);
  }

  return response.json();
}

export const placeNoteApi = {
  /**
   * Get all place notes
   */
  async getPlaceNotes(): Promise<PlaceNote[]> {
    const response = await fetch(`${getBaseUrl()}/api/place-notes`);
    const data = await handleApiResponse<GetPlaceNotesResponse>(response);

    if (data.status === "error") {
      throw new ApiError(data.error);
    }

    return data.data;
  },

  /**
   * Create a new place note
   */
  async createPlaceNote(input: CreatePlaceNoteInput): Promise<PlaceNote> {
    const response = await fetch(`${getBaseUrl()}/api/place-notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    const data = await handleApiResponse<CreatePlaceNoteResponse>(response);

    if (data.status === "error") {
      throw new ApiError(data.error);
    }

    return data.data;
  },

  /**
   * Update an existing place note
   */
  async updatePlaceNote(
    id: string,
    input: UpdatePlaceNoteInput
  ): Promise<PlaceNote> {
    const response = await fetch(`${getBaseUrl()}/api/place-notes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    const data = await handleApiResponse<UpdatePlaceNoteResponse>(response);

    if (data.status === "error") {
      throw new ApiError(data.error);
    }

    return data.data;
  },

  /**
   * Delete a place note
   */
  async deletePlaceNote(id: string): Promise<void> {
    const response = await fetch(`${getBaseUrl()}/api/place-notes/${id}`, {
      method: "DELETE",
    });

    const data = await handleApiResponse<DeletePlaceNoteResponse>(response);

    if (data.status === "error") {
      throw new ApiError(data.error);
    }
  },
};
