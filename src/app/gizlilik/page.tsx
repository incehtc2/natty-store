export default function GizlilikPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-[#18160f] py-20 px-6 text-center">
        <p className="text-[9px] tracking-mega text-gold/60 mb-4 font-medium">HUKUKİ</p>
        <h1 className="text-4xl font-serif font-medium text-white">Gizlilik Politikası</h1>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-20 space-y-10">
        <p className="text-xs text-warm-gray/60">Son güncelleme: Ocak 2026</p>

        {[
          {
            title: "Toplanan Veriler",
            content: "NATTY olarak; ad, soyad, e-posta adresi, telefon numarası, teslimat adresi ve ödeme bilgileri gibi kişisel verilerinizi yalnızca hizmet sunumu amacıyla işlemekteyiz. Ödeme bilgileriniz doğrudan ödeme altyapı sağlayıcımız (iyzico) tarafından güvenli biçimde işlenir; sunucularımızda saklanmaz.",
          },
          {
            title: "Verilerin Kullanımı",
            content: "Kişisel verileriniz; sipariş işleme, teslimat süreci takibi, müşteri hizmetleri ve yasal yükümlülüklerin yerine getirilmesi amacıyla kullanılmaktadır. Açık onayınız olmaksızın üçüncü taraflarla paylaşılmaz.",
          },
          {
            title: "Çerezler",
            content: "Sitemiz, kullanıcı deneyimini iyileştirmek amacıyla oturum ve tercih çerezleri kullanmaktadır. Tarayıcı ayarlarınızdan çerez tercihlerinizi yönetebilirsiniz. Zorunlu çerezlerin devre dışı bırakılması, bazı işlevlerin çalışmamasına yol açabilir.",
          },
          {
            title: "Veri Güvenliği",
            content: "Verileriniz SSL/TLS şifreleme altyapısı ile korunmaktadır. Sistemlerimize yetkisiz erişimi engellemek için teknik ve idari güvenlik önlemleri uygulanmaktadır.",
          },
          {
            title: "KVKK Kapsamındaki Haklarınız",
            content: "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında; kişisel verilerinize erişme, düzeltme, silme, işlenmesini kısıtlama ve veri taşınabilirliği talep etme haklarına sahipsiniz. Bu haklarınızı kullanmak için destek@natty.com.tr adresine yazabilirsiniz.",
          },
          {
            title: "İletişim",
            content: "Gizlilik politikamıza ilişkin sorularınız için destek@natty.com.tr adresine e-posta gönderebilir ya da +90 212 000 00 00 numaralı hattımızı arayabilirsiniz.",
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
