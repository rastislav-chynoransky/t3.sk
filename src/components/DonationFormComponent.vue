<template>
    <form
        action="https://api.darujme.sk/v1/donations/post/"
        method="post"
        enctype="application/x-www-form-urlencoded"
        autocomplete="off"
    >
        <div class="grid grid-cols-2 -mx-0.5">
            <div class="m-0.5">
                <input
                    v-model="periodicity"
                    id="periodicity_periodical"
                    class="absolute opacity-0 pointer-events-none peer"
                    type="radio"
                    value="periodical"
                />
                <label
                    class="border-2 block cursor-pointer peer-checked:bg-highlight px-3 py-1.5 text-center [font-variation-settings:'wght'_600]"
                    for="periodicity_periodical"
                >
                    Mesačne
                </label>
            </div>
            <div class="m-0.5">
                <input
                    v-model="periodicity"
                    id="periodicity_onetime"
                    class="absolute opacity-0 pointer-events-none peer"
                    type="radio"
                    value="onetime"
                />
                <label
                    for="periodicity_onetime"
                    class="border-2 block cursor-pointer peer-checked:bg-highlight px-3 py-1.5 text-center [font-variation-settings:'wght'_600]"
                >
                    Jednorazovo
                </label>
            </div>
        </div>

        <div
            class="grid -mx-0.5"
            :style="`grid-template-columns: repeat(${predefinedValueOptions.length}, minmax(0, 1fr))`"
        >
            <div
                class="m-0.5"
                v-for="option in predefinedValueOptions"
                :key="option"
            >
                <input
                    v-model="predefinedValue"
                    :id="`value_${option}`"
                    class="absolute opacity-0 pointer-events-none peer"
                    type="radio"
                    :value="option"
                />
                <label
                    :for="`value_${option}`"
                    class="peer-checked:bg-highlight block border-2 cursor-pointer px-3 py-1.5 text-center [font-variation-settings:'wght'_600]"
                >
                    {{ option }}&euro;</label
                >
            </div>
        </div>

        <input
            class="absolute opacity-0 pointer-events-none"
            name="value"
            type="number"
            min="1"
            :value="value"
            required
        />

        <input
            :class="[
                !predefinedValue && customValue
                    ? 'bg-highlight'
                    : 'bg-transparent focus:bg-white',
            ]"
            v-model="customValue"
            class="block border-2 my-0.5 focus:outline-none rounded-none placeholder:text-black/50 px-3 py-1.5 w-full"
            type="number"
            min="1"
            placeholder="Vlastnou sumou"
        />

        <div
            class="grid -mx-0.5"
            :style="`grid-template-columns: repeat(${
                periodicity === 'onetime' ? 3 : 2
            }, minmax(0, 1fr))`"
        >
            <div class="m-0.5">
                <input
                    v-model="paymentMethod"
                    id="payment_method_card"
                    class="absolute opacity-0 pointer-events-none peer"
                    type="radio"
                    name="payment_method_id"
                    :value="paymentMethodCardUuid"
                    required
                />
                <label
                    for="payment_method_card"
                    class="peer-checked:bg-highlight block border-2 cursor-pointer px-3 py-1.5 text-center [font-variation-settings:'wght'_600]"
                    >Kartou</label
                >
            </div>
            <div class="m-0.5">
                <input
                    v-model="paymentMethod"
                    id="payment_method_wire"
                    class="absolute opacity-0 pointer-events-none peer"
                    type="radio"
                    name="payment_method_id"
                    :value="paymentMethodWireUuid"
                    required
                />
                <label
                    for="payment_method_wire"
                    class="peer-checked:bg-highlight block border-2 cursor-pointer px-3 py-1.5 text-center [font-variation-settings:'wght'_600]"
                    >Prevodom</label
                >
            </div>
            <div class="m-0.5" v-if="periodicity === 'onetime'">
                <input
                    id="internet_banking"
                    class="absolute opacity-0 pointer-events-none peer"
                    type="radio"
                    v-model="internetBanking"
                    :value="true"
                />
                <label
                    for="internet_banking"
                    class="peer-checked:bg-highlight block border-2 cursor-pointer px-1.5 py-1.5 text-center [font-variation-settings:'wght'_600]"
                    >IB
                </label>
            </div>
        </div>

        <div class="grid grid-cols-3 -mx-0.5" v-if="internetBanking">
            <div class="m-0.5">
                <input
                    v-model="paymentMethod"
                    id="payment_method_tatra_pay"
                    class="absolute opacity-0 pointer-events-none peer"
                    type="radio"
                    name="payment_method_id"
                    :value="paymentMethodTatraPayUuid"
                    required
                />
                <label
                    for="payment_method_tatra_pay"
                    class="peer-checked:bg-highlight block border-2 cursor-pointer px-3 py-1.5 text-center [font-variation-settings:'wght'_600]"
                    >TatraPay</label
                >
            </div>
            <div class="m-0.5">
                <input
                    v-model="paymentMethod"
                    id="payment_method_sporo_pay"
                    class="absolute opacity-0 pointer-events-none peer"
                    type="radio"
                    name="payment_method_id"
                    :value="paymentMethodSporoPayUuid"
                    required
                />
                <label
                    for="payment_method_sporo_pay"
                    class="peer-checked:bg-highlight block border-2 cursor-pointer px-3 py-1.5 text-center [font-variation-settings:'wght'_600]"
                    >SporoPay</label
                >
            </div>
            <div class="m-0.5">
                <input
                    v-model="paymentMethod"
                    id="payment_method_vub"
                    class="absolute opacity-0 pointer-events-none peer"
                    type="radio"
                    name="payment_method_id"
                    :value="paymentMethodVubUuid"
                    required
                />
                <label
                    for="payment_method_vub"
                    class="peer-checked:bg-highlight block border-2 cursor-pointer px-3 py-1.5 text-center [font-variation-settings:'wght'_600]"
                    >VÚB</label
                >
            </div>
        </div>

        <div class="-my-0.5">
            <input
                type="text"
                name="first_name"
                class="bg-transparent focus:bg-white block border-2 my-1 focus:outline-none rounded-none placeholder:text-black/50 px-3 py-1.5 w-full"
                placeholder="Krstné meno"
                required
            />

            <input
                type="text"
                name="last_name"
                class="bg-transparent focus:bg-white block border-2 my-1 focus:outline-none rounded-none placeholder:text-black/50 px-3 py-1.5 w-full"
                placeholder="Priezvisko"
                required
            />

            <input
                type="text"
                name="email"
                class="bg-transparent focus:bg-white block border-2 my-1 focus:outline-none rounded-none placeholder:text-black/50 px-3 py-1.5 w-full"
                placeholder="E-mail"
                required
            />
        </div>

        <div class="mt-3">
            <label>
                <input
                    class="accent-highlight border-2 leading-4 mr-1"
                    type="checkbox"
                    required
                />
                Súhlasím s
                <a
                    class="underline hover:no-underline"
                    href="https://darujme.sk/pravidla-a-podmienky/"
                    >podmienkami DARUJME.sk</a
                >
            </label>
        </div>

        <button
            class="bg-black block border-2 border-black mt-3 px-3 py-1.5 text-gray active:text-highlight text-sm [font-variation-settings:'wght'_600]"
            type="submit"
        >
            Darovať
        </button>

        <input
            type="hidden"
            name="campaign_id"
            value="ce17921d-280e-4c5d-830a-2adf4ef62247"
        />
    </form>
</template>

<script>
export default {
    data() {
        return {
            predefinedValue: null,
            customValue: null,
            paymentMethod: null,
            periodicity: 'periodical',
            paymentMethodTatraPayUuid: '38409407-c4ec-4060-b4a1-4792f29335ad',
            paymentMethodSporoPayUuid: 'c07e714c-74ed-4ac6-ab63-3898a73f1fa0',
            paymentMethodVubUuid: 'f2e7956e-a3f6-4bff-9e18-2ab3096a5bed',
            internetBanking: false,
        }
    },
    watch: {
        periodicity(value) {
            this.predefinedValue = null

            if (value === 'periodical') {
                this.internetBanking = false
            }
        },
        customValue(value) {
            if (value) {
                this.predefinedValue = null
            }
        },
        predefinedValue(value) {
            if (value) {
                this.customValue = null
            }
        },
        paymentMethod(value) {
            if (value === null || this.internetBankingMethods.includes(value)) {
                return
            }

            this.internetBanking = false
        },
        internetBanking(value) {
            if (value || this.paymentMethod in this.internetBankingMethods) {
                this.paymentMethod = null
            }
        },
    },
    computed: {
        internetBankingMethods() {
            return [
                this.paymentMethodTatraPayUuid,
                this.paymentMethodSporoPayUuid,
                this.paymentMethodVubUuid,
            ]
        },
        predefinedValueOptions() {
            if (this.periodicity === 'periodical') {
                return [10, 15, 20, 30]
            } else {
                return [10, 30, 50, 100]
            }
        },
        value() {
            return this.predefinedValue ?? this.customValue ?? ''
        },
        paymentMethodCardUuid() {
            return this.periodicity === 'periodical'
                ? 'b71ff7cf-39f7-40db-8a34-e1f30292c215'
                : '1342d2af-a343-4e73-9f5a-7593b9978697'
        },
        paymentMethodWireUuid() {
            return this.periodicity === 'periodical'
                ? 'f425f4af-74ce-4a9b-82d6-783c93b80f17'
                : '3dcf55d1-6383-45b4-b098-dc588187b854'
        },
    },
}
</script>
