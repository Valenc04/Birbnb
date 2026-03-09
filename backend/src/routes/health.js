export default function registerHealthRoutes(app, _getController) {
    app.get('/health', (req, res) => {
      res.status(200).json({
        "Estado": "OK"
      })
  })
}
