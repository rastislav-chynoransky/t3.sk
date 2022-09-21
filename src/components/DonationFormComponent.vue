<template>
    <form action="https://api.darujme.sk/v1/donations/post/" method="post">
        <div class="flex -mx-0.5">
            <div class="grow m-0.5 relative">
                <input
                    v-model="periodicity"
                    id="periodicity_periodical"
                    class="absolute invisible peer"
                    type="radio"
                    name="periodicity"
                    value="periodical"
                />
                <label
                    class="border-2 block cursor-pointer peer-checked:bg-highlight px-3 py-1.5 text-center [font-variation-settings:'wght'_600]"
                    for="periodicity_periodical"
                >
                    Mesačne
                </label>
            </div>
            <div class="grow m-0.5 relative">
                <input
                    v-model="periodicity"
                    id="periodicity_onetime"
                    class="absolute invisible peer"
                    type="radio"
                    name="periodicity"
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

        <div class="flex -mx-0.5">
            <div class="grow m-0.5 relative">
                <input
                    v-model="predefinedValue"
                    @change="predefinedValueChange"
                    id="value_10"
                    class="absolute invisible peer"
                    type="radio"
                    value="10"
                />
                <label
                    for="value_10"
                    class="peer-checked:bg-highlight block border-2 cursor-pointer px-3 py-1.5 text-center [font-variation-settings:'wght'_600]"
                >
                    10&euro;</label
                >
            </div>
            <div class="grow m-0.5">
                <input
                    v-model="predefinedValue"
                    @change="predefinedValueChange"
                    id="value_20"
                    class="absolute invisible peer"
                    type="radio"
                    value="20"
                />
                <label
                    for="value_20"
                    class="peer-checked:bg-highlight block border-2 cursor-pointer px-3 py-1.5 text-center [font-variation-settings:'wght'_600]"
                >
                    20&euro;</label
                >
            </div>
            <div class="grow m-0.5">
                <input
                    v-model="predefinedValue"
                    @change="predefinedValueChange"
                    id="value_30"
                    class="absolute invisible peer"
                    type="radio"
                    value="30"
                />
                <label
                    for="value_30"
                    class="peer-checked:bg-highlight block border-2 cursor-pointer px-3 py-1.5 text-center [font-variation-settings:'wght'_600]"
                >
                    30&euro;</label
                >
            </div>
        </div>

        <input
            class="absolute opacity-0"
            type="text"
            name="value"
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
            @click="customValueChange"
            @change="customValueChange"
            class="block border-2 my-0.5 focus:outline-none rounded-none placeholder:text-black/50 px-3 py-1.5 w-full"
            type="number"
            min="1"
            placeholder="Vlastnou sumou"
        />

        <div class="flex -mx-0.5">
            <div class="grow m-0.5 relative">
                <input
                    v-model="paymentMethod"
                    id="payment_method_card"
                    class="absolute opacity-0 peer"
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
            <div class="grow m-0.5 relative">
                <input
                    v-model="paymentMethod"
                    id="payment_method_wire"
                    class="absolute opacity-0 peer"
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
            <div class="grow m-0.5 relative" v-if="periodicity === 'onetime'">
                <input
                    v-model="paymentMethod"
                    id="payment_method_paypal"
                    class="absolute opacity-0 peer"
                    type="radio"
                    name="payment_method_id"
                    value="c58f76e1-cade-4300-9531-71e275476edd"
                    required
                />
                <label
                    for="payment_method_paypal"
                    class="peer-checked:bg-highlight block border-2 cursor-pointer px-3 py-1.5 text-center [font-variation-settings:'wght'_600]"
                    >PayPal</label
                >
            </div>
        </div>

        <div class="-my-0.5">
            <input
                type="text"
                name="first_name"
                :class="[formError ? 'border-red' : 'border-black']"
                class="bg-transparent focus:bg-white block border-2 my-1 focus:outline-none rounded-none placeholder:text-black/50 px-3 py-1.5 w-full"
                placeholder="Krstné meno"
                required
            />

            <input
                type="text"
                name="last_name"
                :class="[formError ? 'border-red' : 'border-black']"
                class="bg-transparent focus:bg-white block border-2 my-1 focus:outline-none rounded-none placeholder:text-black/50 px-3 py-1.5 w-full"
                placeholder="Priezvisko"
                required
            />

            <input
                type="text"
                name="email"
                :class="[formError ? 'border-red' : 'border-black']"
                class="bg-transparent focus:bg-white block border-2 my-1 focus:outline-none rounded-none placeholder:text-black/50 px-3 py-1.5 w-full"
                placeholder="E-mail"
                required
            />
        </div>

        <div class="mt-3">
            <label>
                <input
                    class="accent-highlight border-2 leading-4 h-4 w-4"
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
            class="bg-black block mt-3 px-3 py-1.5 text-gray active:text-highlight text-sm [font-variation-settings:'wght'_600]"
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
            predefinedValue: 20,
            customValue: null,
            paymentMethod: null,
            periodicity: 'periodical',
        }
    },
    methods: {
        customValueChange() {
            this.predefinedValue = null
        },
    },
    computed: {
        value() {
            return this.predefinedValue ?? this.customValue ?? ''
        },
        paymentMethodCardUuid() {
            return this.periodicity === 'periodical'
                ? '1342d2af-a343-4e73-9f5a-7593b9978697'
                : 'f425f4af-74ce-4a9b-82d6-783c93b80f17'
        },
        paymentMethodWireUuid() {
            return this.periodicity === 'periodical'
                ? 'b71ff7cf-39f7-40db-8a34-e1f30292c215'
                : 'f425f4af-74ce-4a9b-82d6-783c93b80f17'
        },
    },
    watch: {
        customValue() {},
    },
}
</script>
