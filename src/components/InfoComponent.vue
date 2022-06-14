<template>
  <div class="font-gates text-base tracking-normal bg-white fixed inset-0 overflow-y-auto overscroll-none px-8 py-16 z-40">
    <div class="flex flex-wrap">
      <div class="lg:w-1/2 px-8">
        <div class="max-w-sm">
          <h2 class="font-media text-base uppercase">O nás</h2>

          <p class="mt-3">T3 &ndash; kultúrny prostriedok je nezávislé multižánrové kultúrne centrum sídliace v električkovom vozni na Tyršovom nábreží. Zameriava sa na prinášanie nových a inovatívnych umeleckých tendencií a postupov, popularizáciu experimentálnej a ozvláštňujúcej tvorby, prezentáciu mladých tvorcov, vytváranie priestoru na iné vnímanie umeleckej tvorby a otváranie možností percepcie; reflektovanie aktuálnych spoločenských problémov; sprístupňovanie okrajových a náročnejších žánrov bežnému divákovi a budovanie aktívnej a angažovanej kultúrnej komunity.</p>
          <!-- <p class="mt-3">T3 vám prináša koncerty, autorské čítania, výstavy, performancie, premietania, divadlá či žánre prestupujúce predstavenia.</p> -->
          <p class="mt-3">Sme otvorení vašim nápadom či žiadostiam o prenájom. V prípade záujmu o využitie nášho priestoru nás kontaktujte. Ak váš projekt či podujatie zapadá do našej dramaturgie, vieme sa dohodnúť na veľmi priaznivých podmienkach.</p>
        </div>

        <div class="max-w-full">
          <img class="max-w-lg my-[3.25rem]" src="/src/assets/tyrsak.jpeg" alt="T3 na Tyršovom nábreží">
        </div>
      </div>
      <div class="lg:w-1/2 px-8">
        <h2 class="font-media text-base uppercase">Kontakt</h2>

        <table class="mt-3">
          <tr>
            <td class="pr-3">e-mail</td>
            <td><a class="underline hover:no-underline active:text-highlight" href="mailto:prostriedok.t3@gmail.com" target="_blank">prostriedok.t3@gmail.com</a></td>
          </tr>
          <tr>
            <td class="pr-3">instagram</td>
            <td><a class="underline hover:no-underline active:text-highlight" href="https://www.instagram.com/t3kulturnyprostriedok/" target="_blank">@t3kulturnyprostriedok</a></td>
          </tr>
          <tr>
            <td class="pr-3">facebook</td>
            <td><a class="underline hover:no-underline active:text-highlight" href="https://fb.me/T3.kulturny.prostriedok" target="_blank">T3.kulturny.prostriedok</a></td>
          </tr>
        </table>
        <iframe class="grayscale h-64 max-w-lg mt-4 w-full" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2662.676205189234!2d17.114085815648956!3d48.13576737922336!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476c894ba8a682f7%3A0x5ef920aa01f0c604!2sT3%20-%20kult%C3%BArny%20prostriedok!5e0!3m2!1sen!2ssk!4v1655149273176!5m2!1sen!2ssk" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>

        <h2 class="font-media mt-[3.25rem] text-base uppercase">Newsletter</h2>

        <div class="max-w-lg">
          <p class="mt-3">Raz mesačne vám zašleme súhrn nadchádzajúcich podujatí a občasne vás budeme informovať o dôležitých novinkách.</p>
        </div>

        <form action="https://t3.us14.list-manage.com/subscribe" method="POST">
          <div class="flex max-w-lg mt-3 w-full">
            <input type="email" name="email" class="bg-transparent focus:bg-[white] block border-2 border-r-0 border-black grow focus:outline-none placeholder:text-black px-3 py-1.5" placeholder="e-mail">
            <button class="bg-black block px-3 text-sm text-white active:text-highlight [font-variation-settings:'wght'_600]">Odoberať</button>
            <input type="hidden" name="u" value="7c01b30bd3bfc1c97c5551123">
            <input type="hidden" name="id" value="a21376b9fb">
          </div>
        </form>

        <h2 class="font-media mt-[3.25rem] text-base uppercase">Fakturačné údaje</h2>
        <p class="mt-3">
          UM, občianske združenie<br>
          Amurská 54, 821 06 Bratislava<br>
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
        </p>
      </div>

      <div class="w-full px-8">
        <p class="text-sm">Z verejných zdrojov finančne podporujú</p>
        <div class="flex mt-3">
          <img src="/src/assets/fpu.svg" class="h-8 pr-8" alt="Fond na podporu umenia">
          <img src="/src/assets/ba.png" class="h-8 pr-8" alt="Nadácia mesta Bratislavy">
          <img src="/src/assets/bsk.svg" class="h-8 pr-8" alt="Bratislavský samosprávny kraj">
        </div>
      </div>

    </div>
  </div>
</template>