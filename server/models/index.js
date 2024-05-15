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
    timestamps: true 
});

Angajati.belongsToMany(Santier, {
    through: AngajatiSantiere,
    foreignKey: 'idAngajat',
    otherKey: 'idSantier'
});

Santier.belongsToMany(Angajati, {
    through: AngajatiSantiere,
    foreignKey: 'idSantier',
    otherKey: 'idAngajat'
});

AngajatiSantiere.belongsTo(Santier, { foreignKey: 'idSantier' });
AngajatiSantiere.belongsTo(Angajati, { foreignKey: 'idAngajat' });

Angajati.hasMany(Concedii, {
    foreignKey:'idAngajat',
    as:'concedii'
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