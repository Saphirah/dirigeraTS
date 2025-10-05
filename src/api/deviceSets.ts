import type { Got } from 'got' with { 'resolution-mode': 'require' }
import type { Device } from '../types/device/Device'
import type { Home } from '../types/Home'
import type { DeviceSet } from '../types/DeviceSet'
import { ExactlyOne } from '../types/ExactlyOne'

export default (got: Got) => {
  return {
    async list() {
      const home = await got.get(`home`).json<Home>()
      return home.deviceSets
    },

    async create({ name, icon }: Pick<DeviceSet, 'name' | 'icon'>) {
      return await got
        .post(`device-set`, {
          json: {
            name,
            icon,
          },
        })
        .json<{ id: string }>()
    },

    async delete({ id }: { id: string }) {
      await got.delete(`device-set/${id}`)
    },

    async update({ id, name, icon }: DeviceSet) {
      await got
        .put(`device-set/${id}`, {
          json: {
            name,
            icon,
          },
        })
        .json()
    },

    async updateConfiguration({
      id,
      deviceIds,
      roomId,
      remoteLinkIds,
    }: {
      id: string
      deviceIds: string[]
      roomId?: string
      remoteLinkIds?: string[]
    }) {
      await got
        .patch(`device-set/${id}/configuration`, {
          json: {
            deviceIds,
            roomId,
            remoteLinkIds,
          },
        })
        .json()
    },

    async setIsOn({ id, isOn }: { id: string; isOn: boolean }) {
      await got
        .patch(`devices/set/${id}`, {
          json: [
            {
              attributes: {
                isOn,
              },
            },
          ],
        })
        .json()
    },

    /**
     * @deprecated Use the new setAttribute method instead.
     */
    async setAttributes({
      id,
      attributes,
      transitionTime,
    }: {
      id: string
      attributes: ExactlyOne<Device['attributes']>
      transitionTime?: number
    }) {
      await got
        .patch(`devices/set/${id}`, {
          json: [
            {
              attributes,
              transitionTime,
            },
          ],
        })
        .json()
    },
  }

  async function setAttribute<K extends keyof Device['attributes']>({
    id,
    key,
    value,
    transitionTime,
  }: {
    id: string
    key: K
    value: Device['attributes'][K]
    transitionTime?: number
  }) {
    await got
      .patch(`devices/set/${id}`, {
        json: [
          {
            attributes: { [key]: value },
            transitionTime,
          },
        ],
      })
      .json()
  }
}
