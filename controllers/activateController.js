class ActivateController {
    async activate(req, res) {
        try {

            res.json({ message: "ok" })

        } catch (error) {
            res.status(500).json({ message: "Faid to save user in db" })
        }
    }


}


module.exports = new ActivateController();