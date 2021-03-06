const DanhGia = require('../models/danhGiaModel');
const AppError = require('../utils/appError');
const mongoose = require('mongoose');

class DanhGiaController {
    async getAll(req, res, next) {
        await DanhGia.find()
            .then(data => {
                res.status(200).json({
                    status: 'success',
                    results: data.length,
                    data
                })
            })
            .catch(next);
    }

    async postAPI(req, res, next) {
        const danhGiaMoi = new DanhGia(req.body);
        await danhGiaMoi.save()
            .then((data) => {
                res.status(201).json({
                    status: 'success',
                    data
                })
            })
            .catch(next);
    };

    async getAPIById(req, res, next) {
        await DanhGia.findById(req.params.id)
            .then(data => {
                if (!data) {
                    return res.status(404).json({
                        status: 'error',
                        message: 'Không tìm thấy',
                    });
                }
                res.status(201).json({
                    status: 'success',
                    data
                })
            })
            .catch(next);
    };

    async updateAPI(req, res, next) {
        const data = req.body;
        await DanhGia.findByIdAndUpdate(req.params.id, data)
            .then(data => {
                res.status(201).json({
                    status: 'success',
                    data
                })
            })
            .catch(next);
    };

    async deleteAPI(req, res, next) {
        await DanhGia.findByIdAndRemove(req.params.id)
            .then(data => {
                if (!data) {
                    return res.status(404).json({
                        status: 'error',
                        message: 'Không tìm thấy',
                    });
                }
                res.status(201).json({
                    status: 'success',
                    data
                })
            })
            .catch(next);
    };

    async danhGiaTheoTin(req, res, next) {
        const xepLoai = req.query.xepLoai * 1;
        if (xepLoai) {
            await DanhGia.find({
                tinTuyenDung: req.params.id,
                xepLoai: xepLoai
            })
                .then(data => {
                    res.status(201).json({
                        status: 'success',
                        total: data.length,
                        data
                    })
                })
                .catch(next);
        } else {
            await DanhGia.find({
                tinTuyenDung: req.params.id
            })
                .then(data => {
                    res.status(201).json({
                        status: 'success',
                        total: data.length,
                        data
                    })
                })
                .catch(next);
        }
    };

    async demDanhGiaTheoXepLoai(req, res, next) {
        await DanhGia.aggregate([
            { $match: { 'tinTuyenDung': mongoose.Types.ObjectId(req.params.id) } },
            {
                $group: {
                    _id:
                        { tinTuyenDung: '$tinTuyenDung', xepLoai: '$xepLoai' },
                    tong: { $sum: 1 }
                }
            },
            {
                $replaceRoot: {
                    newRoot: { danhGia: "$_id", tong: '$tong' }
                }
            }
        ])
            .then(data => {
                res.status(201).json({
                    status: 'success',
                    data
                })
            })
            .catch(next);
    };
}
module.exports = new DanhGiaController;