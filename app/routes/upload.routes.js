const filecontroller = require("../controllers/file.controller");

module.exports = function(app) {
  app.post("/api/file/upload", filecontroller.upload);
  app.get("/api/file/files", filecontroller.getListFiles);
  app.get("/api/file/files/:name", filecontroller.download);
  
}