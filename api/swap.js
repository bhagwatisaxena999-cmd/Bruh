// This file handles the "Face Stitching" logic to ensure 100% realism
export default async function handler(req, res) {
  const { userImage, generatedImage } = req.body;

  try {
    // We use the ReActor/InsightFace engine via Hugging Face API
    const response = await fetch(
      "https://api-inference.huggingface.co/models/tonyassi/face-swap",
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: {
            target_image: generatedImage, // The Handshake Photo
            swap_image: userImage,        // Your Face Photo
          },
        }),
      }
    );

    const result = await response.blob();
    // Converts the processed image back to a format the website can show
    const buffer = Buffer.from(await result.arrayBuffer());
    res.setHeader('Content-Type', 'image/png');
    res.send(buffer);
    
  } catch (error) {
    res.status(500).json({ error: "Face swap failed" });
  }
            }
