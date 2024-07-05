<template>
	<NavbarComponents/>
	<router-view/>
</template>

<script>
import NavbarComponents from '@/components/NavbarComponents.vue';

export default {
	name: "App",
	components: {
		NavbarComponents
	},
}
</script>