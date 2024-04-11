const {Sequelize, DataTypes} =require("sequelize");
const Database= require("../configs/database.config");

const AngajatiModel = require("./angajati");
const Angajati= AngajatiModel(Database,Sequelize);

const ConcediiModel=require("./concedii");
const Concedii= ConcediiModel(Database,Sequelize);

const PontajModel=require("./pontaj");
const Pontaj=PontajModel(Database,Sequelize);

const SantierModel=require("./santier");
const Santier=SantierModel(Database,Sequelize);

const AngajatiSantiere = Database.define('angajati_santiere', {
    idAngajat: {
        type: DataTypes.INTEGER,
        references: {
            model: Angajati,
            key: 'idAngajat'
        }
    },
    idSantier: {
        type: DataTypes.INTEGER,
        references: {
            model: Santier,
            key: 'id'
        }
    }
}, {
    tableName:"angajati_santier",
    timestamps: false 
});

Angajati.belongsToMany(Santier, {
    through:{model: AngajatiSantiere, unique: false}
});

Santier.belongsToMany(Angajati,{
    through:{model: AngajatiSantiere, unique: false}
});

Angajati.hasMany(Concedii, {
    foreignKey:'idAngajat'
});
Concedii.belongsTo(Angajati, {
    foreignKey:'idAngajat'
});

Angajati.hasMany(Pontaj, {
    foreignKey:'idAngajat'
});
Pontaj.belongsTo(Angajati, {
    foreignKey:'idAngajat'
});

Santier.hasMany(Pontaj,{
    foreignKey:'idSantier'
});
Pontaj.belongsTo(Santier, {
    foreignKey:'idSantier'
});


module.exports = {
    Angajati,
    Santier,
    Concedii,
    Pontaj,
    Santier,
    AngajatiSantiere,
    connection: Database
}