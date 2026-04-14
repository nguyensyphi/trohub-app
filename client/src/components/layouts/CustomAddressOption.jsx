import { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { provincesArr } from "@/lib/constant"
import { MapContainer } from "../maps"
import { CustomInput } from "../forms"
import CustomSelect from "../forms/CustomSelect"
import {
  apiGetDistrictsByProvinceId,
  apiGetLocationsFromSearchTerm,
  apiGetWardsByDistrictId,
} from "@/apis/external"
import useDebounce from "@/hooks/useDebounce"

const CustomAddressOption = ({ form }) => {
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])
  const [locations, setLocations] = useState([])

  const provinceId = form.watch("provinceId")
  const districtId = form.watch("districtId")
  const wardId = form.watch("wardId")
  const addressBonus = form.watch("addressBonus")
  const address = form.watch("address")

  // Get all provinces

  useEffect(() => {
    setProvinces(provincesArr.map((el) => ({ label: el.name, value: el.idProvince })))
  }, [])

  // Fetch districts from province id
  useEffect(() => {
    const fetchDistricts = async () => {
      const response = await apiGetDistrictsByProvinceId(provinceId)
      if (response.status === 200) {
        setDistricts(response.data?.map((el) => ({ label: el.name, value: el.idDistrict })))
      }
    }
    if (provinceId) {
      fetchDistricts()
    }
  }, [provinceId])

  // Fetch wards from district id
  useEffect(() => {
    const fetchDistricts = async () => {
      const response = await apiGetWardsByDistrictId(districtId)
      if (response.status === 200) {
        setWards(response.data?.map((el) => ({ label: el.name, value: el.idCommune })))
      }
    }
    if (districtId) fetchDistricts()
  }, [districtId])

  // Update labels when change
  useEffect(() => {
    if (provinceId && provinces.length > 0)
      form.setValue("province", provinces.find((el) => el.value === provinceId)?.label)
    if (districtId && districts.length > 0)
      form.setValue("district", districts.find((el) => el.value === districtId)?.label)
    if (wardId && wards.length > 0) form.setValue("ward", wards.find((el) => el.value === wardId)?.label)
  }, [provinceId, provinces, districtId, districts, wardId, wards, form])

  const addressBonusDebounce = useDebounce(addressBonus, 700)

  useEffect(() => {
    const address = Array(4).fill("")
    if (provinceId) address[3] = handleTakeNameFromId(provinces, provinceId)
    if (districtId) address[2] = handleTakeNameFromId(districts, districtId)
    if (wardId) address[1] = handleTakeNameFromId(wards, wardId)
    if (addressBonusDebounce) address[0] = addressBonusDebounce

    if (provinceId || districtId || wardId) {
      const addressText = address.filter((el) => !!el).join(", ")
      form.setValue("address", addressText)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provinceId, districtId, wardId, addressBonusDebounce])

  const handleTakeNameFromId = (options = [], id) => {
    return options.find((el) => el.value === id)?.label
  }

  // Get locations from address text
  useEffect(() => {
    const fetchLocations = async () => {
      const response = await apiGetLocationsFromSearchTerm(address)
      if (response.status === 200) {
        const dataFormat = response.data?.map((el) => ({
          longitude: +el.lon,
          latitude: +el.lat,
          displayName: el.display_name,
        }))
        setLocations(dataFormat)
      }
    }
    if (address) fetchLocations()
  }, [address])
  return (
    <div className="grid grid-cols-2 gap-4">
      <CustomSelect
        form={form}
        id="provinceId"
        label="Tỉnh / Thành phố"
        options={provinces}
        placeholder="Chọn"
        isRequired={true}
      />
      <CustomSelect form={form} id="districtId" label="Quận / Huyện" options={districts} placeholder="Chọn" />
      <CustomSelect form={form} id="wardId" label="Phường / Xã" options={wards} placeholder="Chọn" />
      <CustomInput form={form} id="addressBonus" label="Thôn / Xóm" placeholder="Bổ sung thêm địa chỉ" />
      <div className="col-span-2">
        <CustomInput
          isRequired={true}
          form={form}
          id="address"
          label="Địa chỉ"
          placeholder="Địa chỉ đầy đủ"
          readOnly={true}
        />
      </div>
      {locations && locations.length > 0 && (
        <div className="col-span-2 h-[350px]">
          <MapContainer locations={locations} zoom={13} />
        </div>
      )}
    </div>
  )
}

export default CustomAddressOption
CustomAddressOption.propTypes = {
  form: PropTypes.shape({
    control: PropTypes.object.isRequired,
    watch: PropTypes.func.isRequired,
    setValue: PropTypes.func.isRequired,
  }).isRequired,
}
