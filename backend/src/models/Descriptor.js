const mongoose = require('mongoose');

const DescriptorSchema = new mongoose.Schema({
    nome: { type: String, required: true, unique: true },
    valor: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Descriptor', DescriptorSchema);
