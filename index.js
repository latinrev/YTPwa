const ytdl = require("ytdl-core");
const Eonil = require("eonil");
const { app, express } = new Eonil({ port: process.env.PORT || 5500, directory: "./public" })
	.StartServer()
	.GetAllInstances();
const emojiStrip = require("emoji-strip");

app.use(express.json({}));

app.get("/download", async (req, res) => {
	const { link, type } = req.query;
	console.log(link, type);
	if (ytdl.validateURL(link)) {
		let {
			videoDetails: { title },
		} = await ytdl.getBasicInfo(link);
		title = title !== "" ? emojiStrip(title.toString("utf8")).trim() : "Video has no name";
		const audio = type === "mp4" ? ytdl(link) : ytdl(link, { quality: "highestaudio" });
		res.writeHead(200, {
			"Content-Type": "application/octet-stream",
			"Content-Disposition": `attachment; filename=${title}.${type}`,
		});
		audio.pipe(res);
	} else {
		res.send("Link is not valid");
	}
});
