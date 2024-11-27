if (typeof window !== "undefined" && typeof fenster === "undefined" && typeof window.fenster === "undefined") {

	!(function(a, b) {
		const fenster = (
		    function() {
		        let isDebug = false;

		        try{
		        	const searchParams = new URL(window.location.href).searchParams;
		        	isDebug = ["1", "true"].includes(searchParams.get("debug"));
		        } catch(e) {
		        }

		        isDebug && console.log("fenster...")

		        let innerWidth = window.innerWidth;
		        let innerHeight = window.innerHeight;

		        let interval = null;
		        let fnResize = null;

		        function subscribeToOffsetUpdates(_fnResize) {
		            fnResize = _fnResize;
		        };

		        function init() {
		            isDebug && console.log("init 'fenster'...");

		            window.famobi.onOffsetChange(offsets => {
		                isDebug && console.log("[offsets] onOffsetChange");
		                update();
		            });

		            update();
		        };

		        function update() {

		            isDebug && console.log(
		                "[offsets] top: %s, right: %s, bottom: %s, left: %s",
		                window.famobi.getOffsets().top,
		                window.famobi.getOffsets().right,
		                window.famobi.getOffsets().bottom,
		                window.famobi.getOffsets().left
		            );

		            innerWidth = window.innerWidth - (window.famobi?.getOffsets()?.right || 0);
		            innerHeight = window.innerHeight - (window.famobi?.getOffsets()?.bottom || 0);

		            isDebug && console.log("[offsets] innerWidth: %s, innerHeight: %s",
		                innerWidth,
		                innerHeight
		            );

		            if(typeof fnResize === "function") {
		                fnResize();
		            }
		        };

		        function test(right = 0, bottom = 0) {

		        	const offsets = {
		                    top: 0,
		                    right,
		                    bottom,
		                    left: 0
		                };

		            window.famobi.getOffsets = () => {
		                return offsets;
		            }

		            window.famobi.adapters.run("viewport", "offsetChanged", offsets);
		        };

		        addEventListener("resize", (event) => {
		            update();
		        });

		        interval = setInterval(() => {
		        	isDebug && console.log("[fenster] checking for onOffsetChange")
		            if (typeof window.famobi?.onOffsetChange === "function") {
		                clearInterval(interval);
		                init();
		            }
		        }, 250);

		        return {
		            get innerHeight() {
		                return innerHeight;
		            },
		            get innerWidth() {
		                return innerWidth;
		            },
		            update: update,
		            subscribeToOffsetUpdates: subscribeToOffsetUpdates,
		            test: test
		        };
		    }
		)();

		b[a] = fenster;
	})("fenster", window);
}