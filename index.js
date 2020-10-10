const ytdl = require("ytdl-core");
const Eonil = require("eonil");
const { app, express } = new Eonil({ port: process.env.PORT || 5500, directory: "./public" })
	.StartServer()
	.GetAllInstances();
const contentDisposition = require('content-disposition');
app.use(express.json({}));

app.get("/download", async (req, res) => {
	const { link, type } = req.query;
	console.log(link, type);
	if (ytdl.validateURL(link)) {
		let {
			videoDetails: { title },
		} = await ytdl.getBasicInfo(link);
		const audio = type === "mp4" ? ytdl(link) : ytdl(link, { quality: "highestaudio" });
		console.log(contentDisposition(title));
		res.writeHead(200, {
			"Content-Type": "application/octet-stream",
			"Content-Disposition": contentDisposition(title + "." + type)
		});
		audio.pipe(res);
	} else {
		res.send("Link is not valid");
	}
});
