export interface IProvinces {
  id: number;
  name_la: string;
  name_en: string;
  name_th: string;
  code: string;
}
export interface IDisticts {
  id: number;
  name_la: string;
  name_en: string;
  name_th: string;
  code: string;
  provinceId: IProvinces;
  postCode: string;
  type: string;
}
