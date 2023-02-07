<template>
    <div
        class="bg-gray fixed inset-0 overflow-y-auto overscroll-none px-4 lg:px-16 pt-8 lg:pt-16 pb-40 z-50"
    >
        <h1 class="font-media text-4xl mb-12">Darujte 2% z daní T3</h1>

        <div class="flex flex-wrap -mx-4 lg:-mx-8">
            <div class="mb-[3.25rem] lg:w-1/2 px-4 lg:px-8">
                <h2 class="mb-4 font-media uppercase leading-snug">Daňové za mňa podáva zamestnávateľ</h2>

                <ul class="list-decimal max-w-sm space-y-2 ml-4">
                    <li>Požiadajte svojho zamestnávateľa o vykonanie ročného zúčtovania preddavkov na daň z príjmov a o vystavenie potvrdenia o zaplatení dane.</li>
                    <li>Vyplňte <a class="underline hover:no-underline" href="/T3_Vyhlasenie_2p.pdf" target="_blank">vyhlásenie o poukázaní 2% dane (pdf)</a>.<br />
                        Uveďte vaše meno, rodné číslo, bydlisko a sumu zodpovedajúcu 2% zaplatenej dane.</li>
                    <li>Najneskôr do 30. apríla 2023 pošlite/doručte oba formuláre daňovému úradu v mieste vášho bydliska.</li>
                </ul>
            </div>
            <div class="lg:w-1/2 px-4 lg:px-8">
                <h2 class="mb-4 font-media uppercase leading-snug">Daňové si podávam sám*a</h2>

                <p>Údaje T3 - kultúrneho prostriedku:</p>

                <p>
                    Obchodné meno (názov): UM<br />
                    IČO: 50040855<br />
                </p>

                <ul class="mt-3 list-decimal max-w-sm space-y-2 ml-4">
                    <li>Vyplňte vyhlásenie na poukázanie podielu zaplatenej dane vyplníte priamo v daňovom priznaní k dani z príjmov.</li>
                    <li>Následne vyplnené daňové priznanie podáte do 31. marca</li>
                </ul>


            </div>

            <!-- <div class="w-full px-4 lg:px-8 mb-12 lg:mb-0"></div> -->
        </div>

        <MenuComponent>
            <MenuLinkComponent :to="{ name: '2-percenta' }">2%</MenuLinkComponent>
            <MenuLinkComponent :to="{ name: 'info' }">Info</MenuLinkComponent>
            <MenuLinkComponent :to="{ name: 'home' }">Program</MenuLinkComponent>
        </MenuComponent>
    </div>
</template>

<script>
import axios from 'axios'
import MenuComponent from '../components/MenuComponent.vue'
import MenuLinkComponent from '../components/MenuLinkComponent.vue'
import DonationFormComponent from '../components/DonationFormComponent.vue'

export default {
    components: { MenuComponent, MenuLinkComponent, DonationFormComponent },
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
