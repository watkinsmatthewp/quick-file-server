const MAX_DISPLAY_FILE_SIZE_BYTES = 1024 * 1024 * 10; // 10MB

var app = new Vue({
  el: "#app",
  data: {
    logFiles: [],
    selectedLogFileIndex: -1,
    title: 'Logs'
  },
  computed: {
      selectedLogFile: function() {
          return this.selectedLogFileIndex >= 0 ? this.logFiles[this.selectedLogFileIndex] : null;
      }
  },
  methods: {
    selectLogFile: function (logFileName) {
      const newLogFileIndex = this.logFiles.findIndex(f => f.name === logFileName);
      if (newLogFileIndex >= 0 && newLogFileIndex !== this.selectedLogFileIndex) {
        const newLogFile = this.logFiles[newLogFileIndex];
        newLogFile.selected = true;
        newLogFile.loaded = newLogFile.downloadOnly;
        this.title = newLogFile.name;

        if (this.selectedLogFile) {
            this.selectedLogFile.content = null;
            this.selectedLogFile.selected = false;
            this.selectedLogFile.loaded = false;
        }
        
        this.selectedLogFileIndex = newLogFileIndex;
        if (!newLogFile.downloadOnly) {
            const logURL = window.location.origin + '/' + newLogFile.name;
            axios.get(logURL).then(response => {
                newLogFile.content = response.data;
                newLogFile.loaded = true;
            }).catch(e => console.error(e));
        }
      }
    },
    convertToHumanReadableSize(bytes) {
        if (bytes < 1024) {
            return `${bytes}B`;
        }

        const kb = bytes / 1024;
        if (kb < 1024) {
            return `${Math.round(kb * 10) / 10} KB`;
        }

        const mb = kb / 1024;
        if (mb < 1024) {
            return `${Math.round(mb * 10) / 10} MB`;
        }

        const gb = mb / 1024;
        if (gb < 1024) {
            return `${Math.round(gb * 10) / 10} GB`;
        }

        const tb = gb / 1024;
        return `${Math.round(tb * 10) / 10} TB`;
    }
  },
  async mounted() {
      const dirURL = window.location.origin + '/dir.txt';
      const response = await axios.get(dirURL);
      for (const line of response.data.split('\n').filter(l => l && l.length)) {
          const dataPoints = line.split(' ').filter(p => p && p.length);
          const file = {
            sizeBytes: parseInt(dataPoints[4]),
            name: dataPoints[8],
            url:  + dataPoints[8],
            loaded: false,
            content: null,
            selected: false
          };
          file.url = window.location.origin + '/' + file.name;
          file.downloadOnly = file.sizeBytes > MAX_DISPLAY_FILE_SIZE_BYTES;
          this.logFiles.push(file);
      }
  }
});
