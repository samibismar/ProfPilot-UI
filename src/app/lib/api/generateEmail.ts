// app/lib/api/generateEmail.ts

export async function generateEmail(studentInput: string, professor: Record<string, unknown>) {
  const response = await fetch("http://localhost:8000/generate-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      student_input: studentInput,
      professor: professor
    })
  });

  if (!response.ok) {
    throw new Error("Failed to generate email");
  }

  const data = await response.json();
  return data.email;
}