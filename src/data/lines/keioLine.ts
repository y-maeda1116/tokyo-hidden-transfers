import type { Line } from '../../domain/types.ts'

// 京王線 32駅（新宿→京王八王子）。座標は WGS84。
// 京王線。新宿→京王八王子、全駅都内。京王新線（新宿〜笹塚）は並走区間のため含めない。
// 駅id は keio-01.. の連番（路線ごとに一意）。
// 座標は OpenStreetMap の route relation (id=11271039) のメンバー順序どおりの停車位置から取得。
// © OpenStreetMap contributors。
export const keioLine: Line = {
  id: 'keio',
  name: '京王線',
  color: '#e5007f',
  category: 'private',
  stations: [
    { id: 'keio-01', name: '新宿', lineId: 'keio', lon: 139.6991484, lat: 35.6904577 },
    { id: 'keio-02', name: '笹塚', lineId: 'keio', lon: 139.6671649, lat: 35.6735243 },
    { id: 'keio-03', name: '代田橋', lineId: 'keio', lon: 139.6594286, lat: 35.6710857 },
    { id: 'keio-04', name: '明大前', lineId: 'keio', lon: 139.6504599, lat: 35.6683079 },
    { id: 'keio-05', name: '下高井戸', lineId: 'keio', lon: 139.6420504, lat: 35.6660765 },
    { id: 'keio-06', name: '桜上水', lineId: 'keio', lon: 139.6320286, lat: 35.6675454 },
    { id: 'keio-07', name: '上北沢', lineId: 'keio', lon: 139.623299, lat: 35.6688199 },
    { id: 'keio-08', name: '八幡山', lineId: 'keio', lon: 139.6156966, lat: 35.6698439 },
    { id: 'keio-09', name: '芦花公園', lineId: 'keio', lon: 139.6086369, lat: 35.6706085 },
    { id: 'keio-10', name: '千歳烏山', lineId: 'keio', lon: 139.6008882, lat: 35.667995 },
    { id: 'keio-11', name: '仙川', lineId: 'keio', lon: 139.5850146, lat: 35.6623088 },
    { id: 'keio-12', name: 'つつじヶ丘', lineId: 'keio', lon: 139.5753341, lat: 35.6580925 },
    { id: 'keio-13', name: '柴崎', lineId: 'keio', lon: 139.5670015, lat: 35.6542039 },
    { id: 'keio-14', name: '国領', lineId: 'keio', lon: 139.5586883, lat: 35.6502272 },
    { id: 'keio-15', name: '布田', lineId: 'keio', lon: 139.5518035, lat: 35.6497794 },
    { id: 'keio-16', name: '調布', lineId: 'keio', lon: 139.5450194, lat: 35.6517962 },
    { id: 'keio-17', name: '西調布', lineId: 'keio', lon: 139.5298138, lat: 35.6571622 },
    { id: 'keio-18', name: '飛田給', lineId: 'keio', lon: 139.5234838, lat: 35.6600705 },
    { id: 'keio-19', name: '武蔵野台', lineId: 'keio', lon: 139.5110585, lat: 35.6641936 },
    { id: 'keio-20', name: '多磨霊園', lineId: 'keio', lon: 139.5026135, lat: 35.6662098 },
    { id: 'keio-21', name: '東府中', lineId: 'keio', lon: 139.4956428, lat: 35.6687114 },
    { id: 'keio-22', name: '府中', lineId: 'keio', lon: 139.4801327, lat: 35.6721865 },
    { id: 'keio-23', name: '分倍河原', lineId: 'keio', lon: 139.4685299, lat: 35.6684631 },
    { id: 'keio-24', name: '中河原', lineId: 'keio', lon: 139.4579012, lat: 35.6595936 },
    { id: 'keio-25', name: '聖蹟桜ヶ丘', lineId: 'keio', lon: 139.4469043, lat: 35.65077 },
    { id: 'keio-26', name: '百草園', lineId: 'keio', lon: 139.4310394, lat: 35.6574825 },
    { id: 'keio-27', name: '高幡不動', lineId: 'keio', lon: 139.4133268, lat: 35.6622097 },
    { id: 'keio-28', name: '南平', lineId: 'keio', lon: 139.3923466, lat: 35.6549697 },
    { id: 'keio-29', name: '平山城址公園', lineId: 'keio', lon: 139.3801778, lat: 35.6475285 },
    { id: 'keio-30', name: '長沼', lineId: 'keio', lon: 139.3660266, lat: 35.6427854 },
    { id: 'keio-31', name: '北野', lineId: 'keio', lon: 139.354327, lat: 35.6444745 },
    { id: 'keio-32', name: '京王八王子', lineId: 'keio', lon: 139.3432415, lat: 35.6578616 },
  ],
}
