import { apiClient } from "@/shared/lib/axios";

export async function deleteUser() {
  const { data: deleteUserResponse } = await apiClient.delete<{
    message: string;
  }>("/api/v1/users/me");

  return deleteUserResponse;
}
