router.post("/api/uploads/exhibitions/sign", auth, async (req, res) => {
  // TODO: později napojit na Cloudflare R2 presigned URL
  const { filename = "image.jpg" } = req.body || {};
  const fakeKey = `exhibitions/${Date.now()}-${filename}`;

  res.json({
    uploadUrl: "FAKE",
    publicUrl: `/uploads/${fakeKey}`,
    key: fakeKey,
  });
});
