type TChart = ISection[]

interface ISection {
	title: string
	content: IItem[]
}

interface IItem {
	key: string
	value: IAtom[]
}

interface IAtom {
	type: "number" | "string" | "id"
	value: string | number
	//TODO: other values
}

enum ESection {
	SONG 		= "Song",
	SYNC_TRACK 	= "SyncTrack",
	EVENTS		= "Events"
}

enum ESongKeys {
	RESOLUTION 	= "Resolution"
}

export default function semanticCheck([chart]: [TChart], location:number, reject: Object) {
	//TODO: implement semantic check
	console.log("performing semantic check")
	//console.log("Is valid chart:", isValidChart(chart))
	//console.log(chart)
	return chart
	//return isValidChart(chart) ? chart : reject
}

function isValidChart(secs: ISection[]) {
	//console.log("Contains song once:", containsSectionOnce(secs, ESection.SONG))
	//console.log("Valid song section:", isValidSongSection( getSection(secs, ESection.SONG) ))
	return(
			secs && Array.isArray(secs)
		&&	containsSectionOnce(secs, ESection.SONG)
		&&	isValidSongSection( getSection(secs, ESection.SONG) )
	)
}

function getSection(sections: ISection[], sectionName: ESection): ISection {
	//console.log("get section: ", sections.find(x => x.title === sectionName))
	// We know it contains section
	return sections.find(x => x.title === sectionName) as ISection
}

function containsSectionOnce(sections: ISection[], sectionName: ESection) {
	//console.log("in cso:", sections, sectionName)
	return sections.filter(x => x.title === sectionName).length === 1
}

function isValidSongSection({title, content}: ISection) {
	return (
		// Resolution is mandatory
			content && Array.isArray(content)
		&& 	content.filter(x => x.key === ESongKeys.RESOLUTION).length === 1
	)
}

//tsc semanticCheck.ts --lib 'es2018','dom' --module 'commonjs'
//npx nearleyc chart.ne -o chart.js
//npx nearley-test chart.js