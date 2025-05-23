module.exports=(sequelize, DataTypes) =>{
    return sequelize.define(
        "Pontaj",
        {
            idPontaj:{
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            latitudine:{
                type: DataTypes.FLOAT,
                allowNull:false
            },
            longitudine:{
                type:DataTypes.FLOAT,
                allowNull: false
            },
            start:{
                type:DataTypes.DATE,
            },
            final:{
                type:DataTypes.DATE,
            },
            durata:{
                type:DataTypes.TIME,
                allowNull:true
            }
        },
        {
            tableName:"Pontaj",
            timestamps: true,
            paranoid: true
        }
    );

}