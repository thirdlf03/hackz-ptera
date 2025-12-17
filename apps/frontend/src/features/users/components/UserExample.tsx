import { useState } from "react";
import { useUsers, useCreateUser } from "../hooks/useUsers";

export function UserExample() {
  const { data, isLoading, error, refetch } = useUsers();
  const createUserMutation = useCreateUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createUserMutation.mutateAsync({ name, email });
    setName("");
    setEmail("");
  };

  const users = data?.users ?? [];

  return (
    <div>
      <h2>User Management (TanStack Query)</h2>

      {error && <div style={{ color: "red" }}>Error: {error.message}</div>}
      {createUserMutation.error && (
        <div style={{ color: "red" }}>Create Error: {createUserMutation.error.message}</div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={createUserMutation.isPending}>
          {createUserMutation.isPending ? "Creating..." : "Create User"}
        </button>
      </form>

      <button onClick={() => refetch()} disabled={isLoading}>
        {isLoading ? "Loading..." : "Fetch Users"}
      </button>

      {isLoading && <div>Loading...</div>}

      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
}
