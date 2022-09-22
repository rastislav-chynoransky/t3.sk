<template>
    <div
        class="bg-gray fixed inset-0 overflow-y-auto overscroll-none px-4 lg:px-8 py-8 lg:py-16 z-50"
    >
        <div class="flex flex-wrap -mx-4">
            <div class="mb-[3.25rem] lg:w-1/2 px-4 lg:px-8">
                <div class="max-w-sm">
                    <h2 id="o-nas" class="font-media uppercase">O nás</h2>

                    <p class="mt-3">
                        T3&nbsp;&ndash;&nbsp;kultúrny prostriedok
                        je&nbsp;nezávislé multižánrové kultúrne centrum sídliace
                        v&nbsp;električkovom vozni na&nbsp;Tyršovom nábreží.
                        Zameriava sa na&nbsp;prinášanie nových
                        a&nbsp;inovatívnych umeleckých tendencií
                        a&nbsp;postupov, popularizáciu experimentálnej
                        a&nbsp;ozvláštňujúcej tvorby, prezentáciu mladých
                        tvorcov, vytváranie priestoru na&nbsp;iné vnímanie
                        umeleckej tvorby a&nbsp;otváranie možností percepcie;
                        reflektovanie aktuálnych spoločenských problémov;
                        sprístupňovanie okrajových a&nbsp;náročnejších žánrov
                        bežnému divákovi a&nbsp;budovanie aktívnej
                        a&nbsp;angažovanej kultúrnej komunity.
                    </p>
                    <!-- <p class="mt-3">T3 vám prináša koncerty, autorské čítania, výstavy, performancie, premietania, divadlá či žánre prestupujúce predstavenia.</p> -->
                    <p class="mt-3">
                        Sme otvorení vašim nápadom či&nbsp;žiadostiam
                        o&nbsp;prenájom. V&nbsp;prípade záujmu o&nbsp;využitie
                        nášho priestoru nás kontaktujte. Ak váš projekt či
                        podujatie zapadá do&nbsp;našej dramaturgie, vieme sa
                        dohodnúť na&nbsp;veľmi priaznivých podmienkach.
                    </p>
                </div>

                <div class="max-w-lg my-6">
                    <div class="pb-[63.18%] relative">
                        <img
                            class="absolute inset-0"
                            src="/src/assets/tyrsak.jpeg"
                            alt="T3 na Tyršovom nábreží"
                        />
                    </div>
                </div>

                <h2 id="newsletter" class="font-media mt-[3.25rem] uppercase">
                    Newsletter
                </h2>

                <div class="max-w-lg">
                    <p class="mt-3">
                        Raz mesačne vám zašleme súhrn nadchádzajúcich podujatí
                        a&nbsp;občasne&nbsp;vás budeme informovať
                        o&nbsp;dôležitých novinkách.
                    </p>
                </div>

                <form
                    @submit="subscribe"
                    :action="`${apiUrl}/subscription`"
                    method="POST"
                >
                    <div class="flex max-w-md mt-3">
                        <input
                            type="email"
                            name="email"
                            :class="{ 'border-red': formError }"
                            class="bg-transparent focus:bg-white block border border-r-0 grow focus:outline-none rounded-none placeholder:text-black/50 px-3 py-1.5"
                            placeholder="E-mail"
                        />
                        <button
                            :class="[
                                formError
                                    ? 'bg-red text-white'
                                    : 'bg-black text-gray',
                            ]"
                            class="block px-3 active:text-highlight text-sm [font-variation-settings:'wght'_600]"
                            type="submit"
                        >
                            Odoberať
                        </button>
                    </div>
                </form>

                <!-- <h2
                    id="fakturacne-udaje"
                    class="font-media mt-[3.25rem] text-base uppercase"
                >
                    Fakturačné údaje
                </h2>
                <div class="mt-3">
                    UM, občianske združenie<br />
                    Amurská 54, 821 06 Bratislava<br />
                    <table class="mt-3">
                        <tr>
                            <td class="pr-3">IČO</td>
                            <td>50 040 855</td>
                        </tr>
                        <tr>
                            <td class="pr-3">DIČ</td>
                            <td>212 038 7126</td>
                        </tr>
                        <tr>
                            <td class="pr-3">IBAN</td>
                            <td>SK54 0900 0000 0051 2130 1726</td>
                        </tr>
                    </table>
                </div> -->
            </div>
            <div class="lg:w-1/2 px-4 lg:px-8">
                <h2 class="font-media uppercase">Kontakt</h2>

                <table class="mt-3">
                    <tr>
                        <td class="pr-3">e-mail</td>
                        <td>
                            <a
                                class="underline hover:no-underline active:text-highlight"
                                href="mailto:prostriedok.t3@gmail.com"
                                target="_blank"
                                >prostriedok.t3@gmail.com</a
                            >
                        </td>
                    </tr>
                    <tr>
                        <td class="pr-3">instagram</td>
                        <td>
                            <a
                                class="underline hover:no-underline active:text-highlight"
                                href="https://www.instagram.com/t3kulturnyprostriedok/"
                                target="_blank"
                                >@t3kulturnyprostriedok</a
                            >
                        </td>
                    </tr>
                    <tr>
                        <td class="pr-3">facebook</td>
                        <td>
                            <a
                                class="underline hover:no-underline active:text-highlight"
                                href="https://fb.me/T3.kulturny.prostriedok"
                                target="_blank"
                                >T3.kulturny.prostriedok</a
                            >
                        </td>
                    </tr>
                </table>
                <div class="h-[19rem] max-w-lg mt-4 relative w-full">
                    <iframe
                        class="absolute grayscale h-full w-full"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2662.676205189234!2d17.114085815648956!3d48.13576737922336!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476c894ba8a682f7%3A0x5ef920aa01f0c604!2sT3%20-%20kult%C3%BArny%20prostriedok!5e0!3m2!1sen!2ssk!4v1655149273176!5m2!1sen!2ssk"
                        allowfullscreen
                        loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>

                <h2 id="podporit" class="font-media mt-[3.25rem] uppercase">
                    Podporiť cez Darujme.sk
                </h2>

                <div class="mt-3 max-w-md">
                    <DonationFormComponent />
                </div>

                <p class="mt-[3.25rem] text-xs">
                    Z verejných zdrojov finančne podporujú
                </p>
                <div class="flex flex-wrap mt-3">
                    <img
                        src="/src/assets/fpu.svg"
                        class="h-5 lg:h-6 mb-5 mr-5 lg:mr-6"
                        alt="Fond na podporu umenia"
                    />
                    <img
                        src="/src/assets/ba.png"
                        class="h-5 lg:h-6 mb-5 mr-5 lg:mr-6"
                        alt="Nadácia mesta Bratislavy"
                    />
                    <img
                        src="/src/assets/bsk.svg"
                        class="h-5 lg:h-6 mb-5 mr-5 lg:mr-6"
                        alt="Bratislavský samosprávny kraj"
                    />
                    <img
                        src="/src/assets/petrzalka.png"
                        class="h-5 lg:h-6 mb-5 mr-5 lg:mr-6"
                        alt="Realizované s finančnou podporou mestskej časti Bratislava-Petržalka"
                    />
                </div>
            </div>

            <!-- <div class="w-full px-4 lg:px-8 mb-12 lg:mb-0"></div> -->
        </div>

        <MenuLinkComponent :to="{ name: 'home' }">Program</MenuLinkComponent>
    </div>
</template>

<script>
import axios from 'axios'
import MenuLinkComponent from '../components/MenuLinkComponent.vue'
import DonationFormComponent from '../components/DonationFormComponent.vue'

export default {
    components: { MenuLinkComponent, DonationFormComponent },
    props: ['event', 'prev', 'next'],
    data() {
        return {
            apiUrl: import.meta.env.VITE_API_URL,
            formError: false,
        }
    },
    mounted() {
        this.$nextTick(() => {
            if (window.location.hash) {
                document.querySelector(window.location.hash)?.scrollIntoView({
                    behavior: 'smooth',
                })
            }
        })
    },
    methods: {
        subscribe(e) {
            e.preventDefault()
            const data = new FormData(e.target)
            axios
                .post(e.target.action, data)
                .then(() => {
                    this.formError = false
                    e.target.reset()
                    e.target.querySelector('[name=email]').placeholder =
                        'Ste prihlásený na odber. Ďakujeme za váš záujem!'
                })
                .catch(() => {
                    this.formError = true
                })
        },
    },
}
</script>
