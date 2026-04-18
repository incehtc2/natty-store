export default function KullanimKosullariPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-[#18160f] py-20 px-6 text-center">
        <p className="text-[9px] tracking-mega text-gold/60 mb-4 font-medium">HUKUKİ</p>
        <h1 className="text-4xl font-serif font-medium text-white">Kullanım Koşulları</h1>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-20 space-y-10">
        <p className="text-xs text-warm-gray/60">Son güncelleme: Ocak 2026</p>

        {[
          {
            title: "Genel",
            content: "Bu web sitesini kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız. NATTY, bu koşulları önceden bildirmeksizin değiştirme hakkını saklı tutar. Siteyi kullanmaya devam etmeniz, güncel koşulları kabul ettiğiniz anlamına gelir.",
          },
          {
            title: "Üyelik",
            content: "Üye olmak için en az 18 yaşında olmanız gerekmektedir. Hesap güvenliğinizden siz sorumlusunuzdur. Şifrenizi kimseyle paylaşmamanızı tavsiye ederiz. Hesabınızda gerçekleşen tüm işlemler size ait sayılır.",
          },
          {
            title: "Satın Alma",
            content: "Sitedeki fiyatlar KDV dahildir. NATTY, stok tükenmesi veya fiyat hatası durumunda siparişi iptal etme hakkını saklı tutar. Bu durumlarda tahsil edilen tutar tam olarak iade edilir.",
          },
          {
            title: "Fikri Mülkiyet",
            content: "Sitedeki tüm içerikler (logo, görsel, metin, tasarım) NATTY'nin mülkiyetindedir ve telif hukukuyla korunmaktadır. İzinsiz kopyalama, dağıtım veya ticari kullanım yasaktır.",
          },
          {
            title: "Sorumluluk Sınırlaması",
            content: "NATTY; teknik arızalar, üçüncü taraf servis kesintileri veya sitede yer alan bilgilerin hatasız olduğuna dair herhangi bir garanti vermez. Yasaların izin verdiği azami ölçüde dolaylı zararlardan sorumlu tutulamaz.",
          },
          {
            title: "Uygulanacak Hukuk",
            content: "Bu koşullar Türkiye Cumhuriyeti kanunlarına tabidir. Uyuşmazlıklarda İstanbul mahkemeleri ve icra daireleri yetkilidir.",
          },
          {
            title: "İletişim",
            content: "Bu koşullara ilişkin sorularınız için destek@natty.com.tr adresine yazabilirsiniz.",
          },
        ].map(({ title, content }) => (
          <section key={title}>
            <h2 className="text-base font-medium text-charcoal mb-3">{title}</h2>
            <p className="text-sm text-warm-gray font-light leading-relaxed">{content}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
