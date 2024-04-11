const Database = require("../models").connection;

const controller = {
    sync: async (req, res) => {
        try {
            await Database.sync({ alter: true });
            res.status(200).json({
                message: "Database sync was done successfully.",
            });
        } catch (err) {
            const errorMessage = `Error while trying to sync the database: ${err.message}.`;
            console.error(errorMessage);
            res.status(500).json({ message: errorMessage });
        }
    },
};

module.exports = controller;
