import CustomSelect from "../forms/CustomSelect"
import { CustomInput } from "../forms"
import { memo, useEffect, useState } from "react"
import { provincesArr } from "@/lib/constant"
import { apiGetDistrictsByProvinceId, apiGetWardsByDistrictId } from "@/apis/external"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { Form } from "../ui/form"
import { Button } from "../ui/button"

const FormSchema = z.object({
  provinceId: z.string().optional(),
  province: z.string().optional(),
  district: z.string().optional(),
  ward: z.string().optional(),
  districtId: z.string().optional(),
  wardId: z.string().optional(),
  address: z.string().optional(),
  addressBonus: z.string().optional(),
})

const CustomAddressV2 = () => {
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      provinceId: "",
      province: "",
      districtId: "",
      district: "",
      wardId: "",
      ward: "",
      address: "",
      addressBonus: "",
    },
  })

  const provinceId = form.watch("provinceId")
  const districtId = form.watch("districtId")
  const wardId = form.watch("wardId")
  const addressBonus = form.watch("addressBonus")

  useEffect(() => {
    setProvinces(provincesArr.map((el) => ({ label: el.name, value: el.idProvince })))
  }, [])

  // Cập nhật giá trị từ URL khi URL thay đổi
  useEffect(() => {
    const params = Object.fromEntries([...searchParams])
    form.reset({
      address: params.address,
      provinceId: params.provinceId,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

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

  useEffect(() => {
    const fetchDistricts = async () => {
      const response = await apiGetWardsByDistrictId(districtId)
      if (response.status === 200) {
        setWards(response.data?.map((el) => ({ label: el.name, value: el.idCommune })))
      }
    }
    if (districtId) fetchDistricts()
  }, [districtId])

  useEffect(() => {
    if (!provinceId && searchParams.get("provinceId"))
      form.setValue("provinceId", searchParams.get("provinceId"))
    if (!districtId && searchParams.get("districtId"))
      form.setValue("districtId", searchParams.get("districtId"))
    if (!wardId && searchParams.get("wardId")) form.setValue("wardId", searchParams.get("wardId"))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, provinceId, districtId, wardId])
  console.log(form.getValues())
  const onSubmit = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    const address = Array(4).fill("")
    if (provinceId) {
      address[3] = handleTakeNameFromId(provinces, provinceId)
      newSearchParams.set("provinceId", provinceId)
    } else newSearchParams.delete("provinceId")
    if (districtId) {
      address[2] = handleTakeNameFromId(districts, districtId)
      newSearchParams.set("districtId", districtId)
    } else newSearchParams.delete("districtId")
    if (wardId) {
      address[1] = handleTakeNameFromId(wards, wardId)
      newSearchParams.set("wardId", wardId)
    } else newSearchParams.delete("wardId")
    if (addressBonus) {
      address[0] = addressBonus
      newSearchParams.set("addressBonus", addressBonus)
    } else newSearchParams.delete("addressBonus")

    const addressText = address.filter((el) => !!el).join(", ")
    newSearchParams.set("address", addressText)
    form.setValue("address", addressText)

    navigate({
      pathname: location.pathname,
      search: newSearchParams.toString(),
    })
  }

  const handleTakeNameFromId = (options = [], id) => {
    return options.find((el) => el.value === id)?.label
  }

  return (
    <Form {...form}>
      <form className="grid grid-cols-5 gap-4 col-span-4" onSubmit={form.handleSubmit(onSubmit)}>
        <CustomSelect
          form={form}
          id="provinceId"
          options={provinces}
          placeholder="Tỉnh / Thành phố"
          isRequired={true}
        />
        <CustomSelect form={form} id="districtId" options={districts} placeholder="Quận / Huyện" />
        <CustomSelect form={form} id="wardId" options={wards} placeholder="Phường / Xã" />
        <CustomInput form={form} id="addressBonus" placeholder="Bổ sung thêm địa chỉ" />
        <Button className="h-8">Cập nhật địa chỉ</Button>
      </form>
    </Form>
  )
}

export default memo(CustomAddressV2)
