// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  const options = {
    method: 'POST',
    body: JSON.stringify({
      email: 'webi.aleks2@gmail.com',
      password: 'test123'
    }),
    headers: {
      "Content-Type": "application/json"
    },
  }
  const response = await fetch('http://localhost:3001/api/v1/user/login', options);
  const result = await response.json();

  return res.status(200).json(result)
}