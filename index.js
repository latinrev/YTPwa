const ytdl = require("ytdl-core");
const SM = require("./ServerManager");
const app = new SM(process.env.PORT || 5500, false, "/public").StartServer().GetApp();

app.get("/download", async (req, res) => {
	const { link } = req.query;
	if (ytdl.validateURL(link)) {
		const {
			videoDetails: { title },
		} = await ytdl.getBasicInfo(link);
		const audio = ytdl(link);
		res.writeHead(200, {
			"Content-Type": "application/octet-stream",
			"Content-Disposition": `attachment; filename="${title}.mp4"`,
		});
		audio.pipe(res);
	} else {
		res.sendStatus(400);
	}
});
