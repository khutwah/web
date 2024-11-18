import { ActivityType } from "@/models/activities";
import { ActivityCard } from "./ActivityCard";

export function ActivityCardStory() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
      <ActivityCard
        id="1"
        isStudentPresent
        studentName="Andrizal Herdiwanto Sukmini"
        halaqahName="Halaqah A1.1"
        surahStart={{ name: 'At-Taubah', verse: "1" }}
        surahEnd={{ name: 'At-Taubah', verse: "26" }}
        timestamp={new Date().toISOString()}
        notes="Santri kesulitan menghafal ayat yang memiliki beberapa titik stop dan kemiripan di antara titik-titik tersebut."
        type={ActivityType.Sabaq}
        labels={["Terbata-bata", "Makhrajul salah: ra"]}
      />
      <ActivityCard
        id="1"
        isStudentPresent
        studentName="Andrizal Herdiwanto Sukmini"
        halaqahName="Halaqah A1.1"
        surahStart={{ name: 'At-Taubah', verse: "1" }}
        surahEnd={{ name: 'At-Taubah', verse: "1" }}
        timestamp={new Date(2024, 1, 1, 7).toISOString()}
        notes="Santri tidak hadir karena sakit."
        type={ActivityType.Sabqi}
        labels={["Terbata-bata"]}
      />
      <ActivityCard
        id="1"
        isStudentPresent
        studentName="Andrizal Herdiwanto Sukmini"
        halaqahName="Halaqah A1.1"
        surahStart={{ name: 'Al-Baqarah', verse: "1" }}
        surahEnd={{ name: 'Al-Baqarah', verse: "286" }}
        timestamp={new Date(2024, 1, 1, 7).toISOString()}
        notes=""
        type={ActivityType.Manzil}
        labels={["Makhrajul salah: ra"]}
      />
      <ActivityCard
        id="1"
        isStudentPresent={false}
        halaqahName="Halaqah A1.1"
        surahStart={{ name: 'Al-Mumtahanah', verse: "1" }}
        surahEnd={{ name: 'Al-Mumtahanah', verse: "13" }}
        timestamp={new Date(2024, 1, 1, 7).toISOString()}
        notes=""
        type={ActivityType.Sabaq}
      />
      <ActivityCard
        id="1"
        isStudentPresent={false}
        halaqahName="Halaqah A1.1"
        surahStart={{ name: 'Al-Mu\'minun', verse: "1" }}
        surahEnd={{ name: 'Al-Mu\'minun', verse: "118" }}
        timestamp={new Date(2024, 10, 10, 27).toISOString()}
        notes=""
        type={ActivityType.Sabqi}
      />
      <ActivityCard
        id="1"
        isStudentPresent={false}
        halaqahName="Halaqah A1.1"
        surahStart={{ name: 'Al-Mu\'minun', verse: "1" }}
        surahEnd={{ name: 'Al-Mu\'minun', verse: "118" }}
        timestamp={new Date(2024, 10, 10, 27).toISOString()}
        notes=""
        type={ActivityType.Manzil}
      />
    </div>
  )
}