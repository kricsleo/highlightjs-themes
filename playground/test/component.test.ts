import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Hello from '../src/components/Header.vue'

describe('Hello.vue', () => {
  it('should render', () => {
    const wrapper = mount(Hello)
    expect(wrapper.html()).toMatchSnapshot()
  })
})
